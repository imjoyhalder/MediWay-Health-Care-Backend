import {isValid, parse} from "date-fns"


export const convertDateTime = async(dateString: string)=>{
    if(!dateString){
        return undefined; 
    }

    const date = parse(dateString, 'yyyy-MM-dd', new Date());

    return isValid(date)? date : undefined 
}