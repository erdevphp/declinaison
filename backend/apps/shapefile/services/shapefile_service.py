import os
import io
import tempfile
import zipfile
import pickle
from pathlib import Path

import geopandas as gpd

# Forcer la reconstruction des fichiers .shx manquants
os.environ['SHAPE_RESTORE_SHX'] = 'YES'


class ShapefileService:
    """Service de gestion des shapefiles"""

    REQUIRED_COLUMNS = {
        'region': ['REGION', 'C_RG'],
        'district': ['DISTRICT', 'C_DST', 'REGION'],
        'commune': ['COMMUNE', 'DISTRICT', 'REGION'],
        'fokontany': ['FOKONTANY', 'COMMUNE', 'R_CODE', 'D_CODE'],
    }

    _temp_file_path = None

    # ==================== GESTION FICHIER TEMPORAIRE ====================

    @classmethod
    def _get_temp_file(cls):
        """Retourne le chemin du fichier temporaire"""
        if cls._temp_file_path is None:
            temp_dir = tempfile.gettempdir()
            cls._temp_file_path = os.path.join(temp_dir, 'shapefile_data.pkl')
        return cls._temp_file_path

    @classmethod
    def _save_gdfs(cls, gdfs):
        """Sauvegarde les GeoDataFrames dans un fichier"""
        temp_file = cls._get_temp_file()
        with open(temp_file, 'wb') as f:
            pickle.dump(gdfs, f)
        print(f"✅ Données sauvegardées dans {temp_file}")

    @classmethod
    def _load_gdfs(cls):
        """Charge les GeoDataFrames depuis le fichier"""
        temp_file = cls._get_temp_file()
        if os.path.exists(temp_file):
            with open(temp_file, 'rb') as f:
                return pickle.load(f)
        return {}

    # ==================== LECTURE SHAPEFILE ====================

    @classmethod
    def _read_shapefile(cls, file) -> gpd.GeoDataFrame:
        """Lit un shapefile depuis un fichier uploadé (.shp ou .zip)"""
        
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            file_path = tmp_path / file.name
            
            # Sauvegarder le fichier uploadé
            with open(file_path, 'wb') as f:
                for chunk in file.chunks():
                    f.write(chunk)
            
            # Si c'est un ZIP, l'extraire
            if file.name.endswith('.zip'):
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(tmp_path)
                # Chercher le fichier .shp dans l'archive
                shp_files = list(tmp_path.glob('*.shp'))
                if not shp_files:
                    shp_files = list(tmp_path.glob('**/*.shp'))
                if not shp_files:
                    raise ValueError("Aucun fichier .shp trouvé dans l'archive ZIP")
                shp_path = shp_files[0]
            else:
                shp_path = file_path
            
            if not shp_path.exists():
                raise ValueError(f"Fichier {shp_path} introuvable")
            
            try:
                gdf = gpd.read_file(str(shp_path))
                if gdf.empty:
                    raise ValueError("Shapefile vide")
                return gdf
            except Exception:
                try:
                    gdf = gpd.read_file(str(shp_path), driver='ESRI Shapefile')
                    return gdf
                except Exception as e:
                    raise ValueError(f"Impossible de lire le shapefile: {str(e)}")

    # ==================== VALIDATION ====================

    @classmethod
    def validate_shapefiles(cls, files: dict) -> dict:
        """Valide les 4 shapefiles uploadés"""
        errors = []
        gdfs = {}

        for key, file in files.items():
            if not file:
                errors.append(f"Fichier {key} manquant")
                continue

            try:
                gdf = cls._read_shapefile(file)
                gdf.columns = [c.upper().strip() for c in gdf.columns]
                
                required = cls.REQUIRED_COLUMNS.get(key, [])
                missing = [col for col in required if col not in gdf.columns]
                
                if missing:
                    errors.append(f"{key}: colonnes manquantes {missing}")
                else:
                    gdfs[key] = gdf
            except Exception as e:
                errors.append(f"{key}: {str(e)}")

        if errors:
            return {'success': False, 'errors': errors, 'data': None}

        # Sauvegarder les données
        cls._save_gdfs(gdfs)
        
        try:
            regions = sorted(gdfs['region']['REGION'].unique().tolist())
            return {
                'success': True,
                'errors': [],
                'data': {
                    'regions': regions,
                    'message': 'Shapefiles validés avec succès'
                }
            }
        except Exception as e:
            return {'success': False, 'errors': [str(e)], 'data': None}

    # ==================== DONNÉES HIÉRARCHIQUES ====================

    @classmethod
    def get_regions(cls) -> list:
        gdfs = cls._load_gdfs()
        if 'region' not in gdfs:
            return []
        return sorted(gdfs['region']['REGION'].unique().tolist())

    @classmethod
    def get_districts(cls, region: str) -> list:
        gdfs = cls._load_gdfs()
        if 'district' not in gdfs:
            return []
        filtered = gdfs['district'][gdfs['district']['REGION'].astype(str) == str(region)]
        return sorted(filtered['DISTRICT'].unique().tolist())

    @classmethod
    def get_communes(cls, region: str, district: str) -> list:
        gdfs = cls._load_gdfs()
        if 'commune' not in gdfs:
            return []
        filtered = gdfs['commune'][
            (gdfs['commune']['REGION'].astype(str) == str(region)) &
            (gdfs['commune']['DISTRICT'].astype(str) == str(district))
        ]
        return sorted(filtered['COMMUNE'].unique().tolist())

    @classmethod
    def get_fokontany(cls, region: str, district: str, commune: str) -> list:
        gdfs = cls._load_gdfs()
        if 'fokontany' not in gdfs:
            return []
        
        region_code = cls._get_region_code(region)
        district_code = cls._get_district_code(district)
        
        if not region_code or not district_code:
            return []
        
        filtered = gdfs['fokontany'][
            (gdfs['fokontany']['R_CODE'].astype(str) == str(region_code)) &
            (gdfs['fokontany']['D_CODE'].astype(str) == str(district_code)) &
            (gdfs['fokontany']['COMMUNE'].astype(str) == str(commune))
        ]
        return sorted(filtered['FOKONTANY'].astype(str).unique().tolist())

    # ==================== CODES ====================

    @classmethod
    def _get_region_code(cls, region: str) -> str:
        gdfs = cls._load_gdfs()
        if 'region' not in gdfs:
            return None
        filtered = gdfs['region'][gdfs['region']['REGION'].astype(str) == str(region)]
        if filtered.empty:
            return None
        return filtered['C_RG'].iloc[0]

    @classmethod
    def _get_district_code(cls, district: str) -> str:
        gdfs = cls._load_gdfs()
        if 'district' not in gdfs:
            return None
        filtered = gdfs['district'][gdfs['district']['DISTRICT'].astype(str) == str(district)]
        if filtered.empty:
            return None
        return filtered['C_DST'].iloc[0]

    # ==================== NETTOYAGE NOMS ====================

    @classmethod
    def _safe_name(cls, name: str) -> str:
        """Nettoie une chaîne pour l'utiliser comme nom de fichier/dossier"""
        replacements = {
            ' ': '_', "'": '_', '"': '_', '/': '_', '\\': '_',
            ':': '_', '*': '_', '?': '_', '<': '_', '>': '_', '|': '_',
        }
        result = str(name)
        for old, new in replacements.items():
            result = result.replace(old, new)
        return result

    # ==================== EXPORT ====================

    @classmethod
    def export_selection(cls, region: str, district: str, commune: str) -> bytes:
        """Exporte les shapefiles sélectionnés selon la convention Lim_Admin"""
        gdfs = cls._load_gdfs()
        
        if not gdfs:
            raise ValueError("Aucune donnée shapefile trouvée. Veuillez revalider les fichiers.")
        
        required_keys = ['region', 'district', 'commune', 'fokontany']
        for key in required_keys:
            if key not in gdfs:
                raise ValueError(f"Donnée '{key}' manquante. Veuillez revalider les fichiers.")
        
        # Filtrer les données
        region_gdf = gdfs['region'][gdfs['region']['REGION'].astype(str) == str(region)]
        district_gdf = gdfs['district'][gdfs['district']['DISTRICT'].astype(str) == str(district)]
        commune_gdf = gdfs['commune'][gdfs['commune']['COMMUNE'].astype(str) == str(commune)]
        
        if region_gdf.empty:
            raise ValueError(f"Région '{region}' non trouvée")
        if district_gdf.empty:
            raise ValueError(f"District '{district}' non trouvé")
        if commune_gdf.empty:
            raise ValueError(f"Commune '{commune}' non trouvée")
        
        region_code = cls._get_region_code(region)
        district_code = cls._get_district_code(district)
        
        fokontany_gdf = gdfs['fokontany'][
            (gdfs['fokontany']['R_CODE'].astype(str) == str(region_code)) &
            (gdfs['fokontany']['D_CODE'].astype(str) == str(district_code)) &
            (gdfs['fokontany']['COMMUNE'].astype(str) == str(commune))
        ]
        
        safe_commune = cls._safe_name(commune)
        safe_district = cls._safe_name(district)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_path = Path(tmpdir)
            
            # Créer la structure de dossiers
            commune_dir = tmp_path / "Limite_Commune"
            district_dir = tmp_path / "Limite_District"
            fokontany_dir = tmp_path / "Limite_Fokontany"
            
            commune_dir.mkdir(parents=True, exist_ok=True)
            district_dir.mkdir(parents=True, exist_ok=True)
            fokontany_dir.mkdir(parents=True, exist_ok=True)
            
            # Exporter la commune
            commune_base = commune_dir / f"Limite_Commune_{safe_commune}"
            commune_gdf.to_file(str(commune_base) + '.shp', encoding='utf-8', driver='ESRI Shapefile')
            
            # Exporter le district
            district_base = district_dir / f"Limite_District_{safe_district}"
            district_gdf.to_file(str(district_base) + '.shp', encoding='utf-8', driver='ESRI Shapefile')
            
            # Exporter les fokontany
            fokontany_base = fokontany_dir / f"Limite_Fokontany_{safe_commune}"
            fokontany_gdf.to_file(str(fokontany_base) + '.shp', encoding='utf-8', driver='ESRI Shapefile')
            
            # Créer le ZIP
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file_path in tmp_path.rglob('*'):
                    if file_path.is_file():
                        zip_file.write(file_path, file_path.relative_to(tmp_path))
            
            zip_buffer.seek(0)
            return zip_buffer.getvalue()

    # ==================== NETTOYAGE ====================

    @classmethod
    def clear_temp_data(cls):
        """Nettoie les données temporaires"""
        temp_file = cls._get_temp_file()
        if os.path.exists(temp_file):
            os.remove(temp_file)
        cls._temp_file_path = None