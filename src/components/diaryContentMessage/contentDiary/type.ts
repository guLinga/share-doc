export interface editor{
  html: string
  text: string
}

export interface props{
  content: string
  date: string
  setDateList: React.Dispatch<React.SetStateAction<string[] | undefined>>
  dateList: string[] | undefined
}