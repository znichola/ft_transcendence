import { Injectable } from '@nestjs/common';
import { CreateDmDto } from './dto/create-conversation.dto';
import { UpdateDmDto } from './dto/update-dm.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DmService
{
	constructor(private prisma: PrismaService){}

	async create(createDmDto: CreateDmDto)
	{
		await this.prisma.conversation.create({
			data: createDmDto,
		})
	}

	async findAll()
	{
		await this.prisma.conversation.findMany({});
	}

	async findOne(id: number)
	{
		await this.prisma.conversation.findUnique({
			where: {}
		});
	}

	async update(id: number, updateDmDto: UpdateDmDto)
	{
		return `This action updates a #${id} dm`;
	}

	async remove(id: number)
	{
		return `This action removes a #${id} dm`;
	}
}
