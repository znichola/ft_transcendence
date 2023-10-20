import {useEffect, useRef} from "react";
import { IGameState } from "../interfaces.tsx";

export default function DrawPong({ width, height, gs }:{width: number, height: number, gs: IGameState}) {
    const canvasRef = useCanvas(gs);
    return <canvas ref={canvasRef} width={width} height={height}/>;
}

function useCanvas(gs: IGameState)
{
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() =>
    {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");

        if (context === null || context === undefined)
            return;
        draw(context, gs);
    }, [gs]);
    return canvasRef;
}

function draw(ctx: CanvasRenderingContext2D | null | undefined, gs: IGameState) {
    if (ctx !== null && ctx !== undefined) {
        //resize les proprietes recu du serveur
        resizeGameState(gs, ctx.canvas);
        //supprime tout
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //dessine balle
        ctx.fillStyle = "rgb(186 230 253)";
        ctx.beginPath();
        ctx.arc(gs.ball.pos.x, gs.ball.pos.y, gs.ball.radius, 0, 2 * Math.PI);
        ctx.fill();
        // gs.balls.forEach((b) => {
        //     const startColor:TColor = { r:186,  g:230,  b:253 };
        //     const endColor:TColor = { r:245,  g:158,  b:11 };
        //     const ac:TColor = lerpRGB(startColor, endColor, (b.speed - 0.25) * 1.5);
        //     ctx.fillStyle = `rgb(${ac.r} ${ac.g} ${ac.b})`;
        //     ctx.beginPath();
        //     ctx.arc(b.pos.x, b.pos.y, b. radius, 0, 2 * Math.PI);
        //     ctx.fill();
        // });

        //dessine les joueurs
        ctx.fillRect(gs.p1.pos.x, gs.p1.pos.y, gs.p1.dim.w, gs.p1.dim.h);
        ctx.fillRect(gs.p2.pos.x, gs.p2.pos.y, gs.p2.dim.w, gs.p2.dim.h);
        //dessine le milieu de terrain
        for (let i = 0; i < ctx.canvas.height; i += 14)
            ctx.fillRect((ctx.canvas.width / 2 - ctx.canvas.width / 510), i, ctx.canvas.width / 170, ctx.canvas.height / 50)
    }
}

function resizeGameState(gs: IGameState, canvas: HTMLCanvasElement){
    //p1
    gs.p1.pos.x *= canvas.width;
    gs.p1.pos.y *= canvas.height;
    gs.p1.dim.w *= canvas.width;
    gs.p1.dim.h *= canvas.height;
    //p2
    gs.p2.pos.x *= canvas.width;
    gs.p2.pos.y *= canvas.height;
    gs.p2.dim.w *= canvas.width;
    gs.p2.dim.h *= canvas.height;
    //ball
    gs.ball.pos.x *= canvas.width;
    gs.ball.pos.y *= canvas.height;
    gs.ball.radius *= canvas.width * canvas.height;
    // gs.balls.forEach((b) => {
    //     b.pos.x *= canvas.width;
    //     b.pos.y *= canvas.height;
    //     b.radius *= canvas.width * canvas.height;
    // });
}