import GitOwner from "@/config/owner"

const formatDateEN = (date : any) => {
    const options : Intl.DateTimeFormatOptions= {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const now = new Date(date).toLocaleDateString('en-US', options)
  
    return now
}

const calculateAge = () =>{ 
  const ageDate = new Date(); 
  return Math.abs(ageDate.getUTCFullYear() - GitOwner.dob);
}

export default {
    formatDateEN ,
    calculateAge
} as const