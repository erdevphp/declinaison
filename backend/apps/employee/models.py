from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class EmployeeManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superuser doit avoir is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superuser doit avoir is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)



class Employee(AbstractUser):
    username = None  # Supprimer username
    
    email = models.EmailField(unique=True, verbose_name="Adresse email")
    first_name = models.CharField(max_length=150, verbose_name="Prénom")
    last_name = models.CharField(max_length=150, verbose_name="Nom")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    
    # Nouveaux champs pour les images
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    cover_picture = models.ImageField(upload_to='covers/', blank=True, null=True)
    
     # Types d'employés possibles
    ROLE_CHOICES = [
        ('CHS', 'Chef de Service'),
        ('CHD', 'Chef de division'),
        ('EMF', 'Employé fixe'),
        ('EFA', 'Employé Fonctionnaire Assimilé'),
        ('ECD', 'Employé de Courte Durée'),
        ('STG', 'Stagiaire'),
        ('ATR', 'Autre'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee', verbose_name="Rôle")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    # Assigner le custom manager
    objects = EmployeeManager()
    
    @property
    def role_label(self):
        return self.get_role_display()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    class Meta:
        verbose_name = "Employé"
        verbose_name_plural = "Employés"
        ordering = ['last_name', 'first_name']