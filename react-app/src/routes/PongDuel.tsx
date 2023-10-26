import { useParams } from "react-router";
import PlayPong from "./PlayPong";
import {useEffect, useState} from "react";
import {pongSocket} from "../socket.ts";
import {ISocRoomCreated} from "../interfaces.tsx";
import {LoadingSpinnerMessage} from "../components/Loading.tsx";
import {useNavigate} from "react-router-dom";

export default function PongDuel() {
  const { player1_login42: p1 } = useParams<"player1_login42">();
  const { player2_login42: p2 } = useParams<"player2_login42">();
  const { game_mode } = useParams<'game_mode'>();
  const [state, setState] = useState<"PENDING"| "READY" | "PLAYING" | 'GAME-OVER'>('PENDING');
  const navigate = useNavigate();
  function getRoomCreated(ev: ISocRoomCreated) {
    console.log('ACOUNA MY FUCKNIG TATAS');
    setState('READY');
    pongSocket.emit('ready', ev);
  }
  function getStartGame(_: ISocRoomCreated) {
    setState('PLAYING');
  }
  function getGameOver(_: ISocRoomCreated) {
    setState('GAME-OVER');
    console.log('game is over motherfucker');
    navigate('/play');
  }
  useEffect(()=> {
    pongSocket.on('room-created', getRoomCreated);
    pongSocket.on('start-game', getStartGame);
    pongSocket.on('game-over', getGameOver);

    return () => {
      pongSocket.off('room-created', getRoomCreated);
      pongSocket.off('start-game', getStartGame);
      pongSocket.off('game-over', getGameOver);
    }
  }, [pongSocket, getStartGame, getRoomCreated]);

  useEffect(() => {
    setTimeout(() => { navigate('/play')}, 1500000);
  }, []);

  if (state == 'PENDING')
    return <LoadingSpinnerMessage message={'waiting for confirmation'}/>;
  if (state == 'READY')
    return <LoadingSpinnerMessage message={'waiting for the other player to join'}/>;
  if (state == 'PLAYING')
    return <PlayPong player1={p1 || ""} player2={p2 || ""} />;
  // if (state == 'GAME-OVER')
}
