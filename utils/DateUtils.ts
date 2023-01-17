import GitOwner from "@/config/owner"
import { differenceInYears, parse } from "date-fns"

const formatDateEN = (date : any) => {
    const options : Intl.DateTimeFormatOptions= {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const now = new Date(date).toLocaleDateString('en-US', options)
  
    return now
}

const calculateAge = ( dateToCalculate = new Date()) => {
  const date = parse(GitOwner.dob, "dd/MM/yyyy", new Date());
  const age = differenceInYears(new Date(), date);
  return age;
}

export default {
    formatDateEN ,
    calculateAge
} as const