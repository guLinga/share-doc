import { Socket } from "socket.io-client";

export interface props{
  socket:React.MutableRefObject<Socket | null>
  userMessage: {
    id: number;
    name: string;
  } | undefined
}