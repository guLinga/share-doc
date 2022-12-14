import { Socket } from "socket.io-client";

export interface props{
  userMessage: {
    id: number;
    name: string;
  } | undefined
  socket:React.MutableRefObject<Socket | null>
}