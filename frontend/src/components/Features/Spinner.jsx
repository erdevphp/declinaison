import { motion } from 'framer-motion'

const Spinner = ({ size = 'md', color = 'white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-3',
  }
  
  const colorClasses = {
    white: 'border-white border-t-transparent',
    primary: 'border-primary-600 border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  }
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
    />
  )
}

export default Spinner