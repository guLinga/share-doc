export interface diaryContentProps{
  date:string
  setDateList: React.Dispatch<React.SetStateAction<string[] | undefined>>
  dateList: string[] | undefined
}