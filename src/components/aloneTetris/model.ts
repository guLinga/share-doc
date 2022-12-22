export const MODELS:{
  [key:string]: {
    row: number,
    col: number
  }
}[] = [
  // L形
  {
    0:{
      row: 2,
      col: 0
    },
    1:{
      row: 2,
      col: 1
    },
    2:{
      row: 2,
      col: 2
    },
    3:{
      row: 1,
      col: 2
    },
  },
  // 凸形
  {
    0:{
      row: 1,
      col: 1
    },
    1:{
      row: 0,
      col: 0
    },
    2:{
      row: 1,
      col: 0
    },
    3:{
      row: 2,
      col: 0
    },
  },
  // 田形
  {
    0:{
      row: 1,
      col: 1
    },
    1:{
      row: 2,
      col: 1
    },
    2:{
      row: 1,
      col: 2
    },
    3:{
      row: 2,
      col: 2
    },
  },
  // 一形
  {
    0:{
      row: 2,
      col: 0
    },
    1:{
      row: 2,
      col: 1
    },
    2:{
      row: 2,
      col: 2
    },
    3:{
      row: 2,
      col: 3
    },
  },
  // z形
  {
    0:{
      row: 1,
      col: 1
    },
    1:{
      row: 1,
      col: 2
    },
    2:{
      row: 2,
      col: 2
    },
    3:{
      row: 2,
      col: 3
    },
  }
]