import { IGameState, IBall, TColor } from "../interfaces.tsx";

export default function draw(
  ctx: CanvasRenderingContext2D | null | undefined,
  gs: IGameState,
) {
  if (ctx !== null && ctx !== undefined) {
    const tmp: IGameState = JSON.parse(JSON.stringify(gs)); //TODO
    //resize les proprietes recu du serveur
    resizeGameState(tmp, ctx.canvas);
    //supprime tout
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //dessine balle
    tmp.balls.forEach((b: IBall): void => {
      if (tmp.type) {
        const startColor: TColor = { r: 186, g: 230, b: 253 };
        const endColor: TColor = { r: 245, g: 158, b: 11 };
        const ac: TColor = lerpRGB(startColor, endColor, b.bounce / 5);
        ctx.fillStyle = `rgb(${ac.r} ${ac.g} ${ac.b})`;
      } else ctx.fillStyle = "rgb(186 230 253)";
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, b.radius, 0, 2 * Math.PI);
      ctx.fill();
    });
    //dessine les joueurs
    ctx.fillStyle = "rgb(186 230 253)";
    ctx.fillRect(tmp.p1.pos.x, tmp.p1.pos.y, tmp.p1.dim.w, tmp.p1.dim.h);
    ctx.fillRect(tmp.p2.pos.x, tmp.p2.pos.y, tmp.p2.dim.w, tmp.p2.dim.h);
    //dessine le score
    // ctx.fillStyle = "rgb(186 230 253)";
    // ctx.font = `${Math.round(
    //   (ctx.canvas.height * ctx.canvas.width) / 9400,
    // )}px sans-serif`;
    // ctx.fillText(`${gs.p1.score}`, ctx.canvas.width / 6, ctx.canvas.height / 7);
    // ctx.fillText(
    //   `${gs.p2.score}`,
    //   (ctx.canvas.width * 5) / 6 -
    //     Math.round((ctx.canvas.height * ctx.canvas.width) / 9400) / 3,
    //   ctx.canvas.height / 7,
    // );
    //dessine le milieu de terrain
    for (let i = 0; i < ctx.canvas.height; i += 14)
      ctx.fillRect(
        ctx.canvas.width / 2 - ctx.canvas.width / 340,
        i,
        ctx.canvas.width / 170,
        10.5,
      ); //TODO adapt
  }
}

function lerpRGB(color1: TColor, color2: TColor, t: number) {
  const color: TColor = { r: 0, g: 0, b: 0 };
  color.r = color1.r + (color2.r - color1.r) * t;
  color.g = color1.g + (color2.g - color1.g) * t;
  color.b = color1.b + (color2.b - color1.b) * t;
  return color;
}

function resizeGameState(gs: IGameState, canvas: HTMLCanvasElement) {
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
  gs.balls.forEach((b) => {
    b.pos.x *= canvas.width;
    b.pos.y *= canvas.height;
    b.radius *= Math.sqrt(
      Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2),
    );
  });
}

export function caseDraw(
  ctx: CanvasRenderingContext2D | null | undefined,
  gs: IGameState,
) {
  if (ctx !== null && ctx !== undefined) {
    if (!gs.p1.afk && !gs.p2.afk) draw(ctx, gs);
    else {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "rgb(186 230 253)";
      ctx.font = `${Math.round(
        (ctx.canvas.height * ctx.canvas.width) / 9400,
      )}px sans-serif`;
      ctx.fillText(
        `Remaining: ${Math.round(gs.timerAfk)}sc`,
        ctx.canvas.width / 8,
        ctx.canvas.height / 2,
      );
    }
  }
}
