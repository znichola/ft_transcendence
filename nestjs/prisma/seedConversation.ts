import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export async function createConversation(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  userLogin1: string,
  userLogin2: string,
) {
  const user1 = await prisma.user.findUnique({
    where: { login42: userLogin1 },
  });

  const user2 = await prisma.user.findUnique({
    where: { login42: userLogin2 },
  });

  if (!user1 || !user2) {
    console.error('One or both users do not exist.');
    return;
  }

  const convo = await prisma.conversation.findFirst({
    where: {
      OR: [
        { user1Id: user1.id, user2Id: user2.id },
        { user1Id: user2.id, user2Id: user1.id },
      ],
    },
  });

  if (convo) {
    console.error(
      user1.login42 + '+' + user2.login42 + 'conversation already exists',
    );
    return;
  }

  const conversation = await prisma.conversation.create({
    data: {
      user1: { connect: { id: user1.id } },
      user2: { connect: { id: user2.id } },
    },
  });

  const s = new Date('2000-10-05T08:46:31.792Z'); // Replace with your desired start date

  const dialogue: Dialogue = [
    { sender: user1.id, time: i(s, 0), text: 'Hello world' },
    { sender: user2.id, time: i(s, 10), text: 'World says hello back' },
    { sender: user1.id, time: i(s, 60), text: 'Not interested in a reponse' },
    { sender: user2.id, time: i(s, 120), text: 'What but why??' },
    { sender: user2.id, time: i(s, 121), text: 'ur so not fair' },
    { sender: user2.id, time: i(s, 122), text: 'why you gotta be a kill joy' },
    { sender: user2.id, time: i(s, 123), text: 'ugh, I hate you, actaully 🤬' },
    { sender: user1.id, time: i(s, 230), text: 'Yeah, but 😛' },
    { sender: user2.id, time: i(s, 400), text: "That's great to hear!" },
    { sender: user2.id, time: i(s, 450), text: 'Your a really a 🤮 ' },
    { sender: user1.id, time: i(s, 451), text: 'Have any plans?' },
    { sender: user2.id, time: i(s, 600), text: 'Not sure yet. Maybe a hike.' },
    { sender: user1.id, time: i(s, 702), text: 'Sounds like a plan! Enjoy!' },
    { sender: user2.id, time: i(s, 891), text: 'Thanks! You too!' },
    { sender: user2.id, time: i(s, 1300), text: 'I hope you ☠️ in a 🔥' },
  ];
  createDialogue(prisma, user1.id, user2.id, conversation.id, dialogue);
}

type Dialogue = { sender: number; text: string; time?: string }[];

async function createDialogue(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  user1: number,
  user2: number,
  conversationID: number,
  dialogue: Dialogue,
) {
  dialogue.map((m) =>
    createDM(prisma, m.sender, conversationID, m.text, m.time),
  );
}

async function createDM(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  senderId: number,
  conversationID: number,
  text: string,
  time?: string,
) {
  await prisma.directMessage.create({
    data: {
      text: text,
      sender: { connect: { id: senderId } },
      conversation: { connect: { id: conversationID } },
      sentAt: time,
    },
  });
}

function i(startDate: Date, incrementMinutes: number) {
  const resultDate = new Date(startDate);
  resultDate.setMinutes(resultDate.getMinutes() + incrementMinutes);
  return resultDate.toISOString();
}
