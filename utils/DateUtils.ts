import GitOwner from "@/config/owner"
import { differenceInYears, format, parse } from "date-fns"
import { enUS } from 'date-fns/locale';

const formatDateEN = (date : string) => {
  const formattedDate = format(new Date(date), 'MMMM d, yyyy', { locale: enUS });
  return formattedDate;
};

const calculateAge = ( dateToCalculate = new Date()) => {
  const date = parse(GitOwner.dob, "dd/MM/yyyy", dateToCalculate);
  const age = differenceInYears(dateToCalculate, date);
  return age;
}

export default {
    formatDateEN ,
    calculateAge
} as const