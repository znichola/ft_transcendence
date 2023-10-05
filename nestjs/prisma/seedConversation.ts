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

  // prettier-ignore
  const dialogue: Dialogue = [
    { sender: user1.id, time: i(s, 0), text: 'Hey, what\'s up? I heard you found a new pwn binary exploit method.' },
    { sender: user2.id, time: i(s, 45), text: 'Yeah, that\'s right! It\'s a technique called "ROP chaining." Let me explain.' },
    { sender: user1.id, time: i(s, 90), text: 'ROP stands for "Return-Oriented Programming." It\'s a way to exploit buffer overflows by chaining together existing code snippets from the program. It\'s like building a puzzle with the program\'s own pieces.' },
    { sender: user2.id, time: i(s, 150), text: 'Exactly! It involves constructing a series of return addresses that point to gadgets—small code sequences in the program—that perform specific tasks. By chaining these gadgets, we can achieve arbitrary code execution.' },
    { sender: user1.id, time: i(s, 210), text: 'Got it! So, you craft a sequence of return addresses to execute the actions you want, like gaining control of the program or escalating privileges. Sounds powerful!' },
    { sender: user2.id, time: i(s, 280), text: 'You got it! But it\'s not always easy. Finding the right gadgets and constructing the chain can be challenging, and it depends on the program\'s memory layout and libraries.' },
    { sender: user1.id, time: i(s, 360), text: 'I can imagine. It requires a deep understanding of assembly language and the program\'s internals. How did you stumble upon this technique?' },
    { sender: user2.id, time: i(s, 430), text: 'Well, I was analyzing a vulnerable program, and I noticed that it had some interesting gadgets. I started experimenting, and eventually, I pieced together this method.' },
    { sender: user1.id, time: i(s, 520), text: 'That\'s impressive! It shows the importance of careful analysis and creativity in the world of cybersecurity. 🌐💻' },
    { sender: user2.id, time: i(s, 600), text: 'Thanks, buddy! It\'s all about exploring and pushing the boundaries. Let\'s team up and explore more security adventures! 🚀👾' },
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
  dialogue.map(
    async (m) =>
      await createDM(prisma, m.sender, conversationID, m.text, m.time),
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
