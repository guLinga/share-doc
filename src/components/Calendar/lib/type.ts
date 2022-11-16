export interface calendatHeaderProps{
  years: number
  months: number
  setYears: (year:number) => void
  setMonths: (month:number) => void
  freezingYear: number
  freezingMonth: number
}

export interface CalendarBodyProps{
  years: number
  months: number
  freezingYear: number
  freezingMonth: number
  freezingDay: number
  dayCilcks: (day:string)=>void
}

export type weekEnum = 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'

export interface calendarAll{
  value: number
  is: boolean
}

export type calenderResult = ({
  value: number
  is: boolean
}[])[]

export interface calendarProps{
  width?: string
  height?: string
  style?: {}
  className?: string
  dayCilck?: (day:string)=>void
}

export interface children{
  value: number
  is: boolean
}