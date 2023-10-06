import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter
{
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost)
	{
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const message = exception.message.replace(/\n/g, '');
		console.error(message);

		switch (exception.code)
		{
			case 'P2000':
				{
					const status = HttpStatus.BAD_REQUEST;
					response.status(status).json({
						statusCode: status,
						message: `[Prisma] ${message}`,
					});
					break;
				}
			case 'P2002':
				{
					const status = HttpStatus.CONFLICT;
					response.status(status).json({
						statusCode: status,
						message: `[Prisma] ${message}`,
					});
					break;
				}
			case 'P2025':
				{
					const status = HttpStatus.NOT_FOUND;
					response.status(status).json({
						statusCode: status,
						message: `[Prisma] ${message}`,
					});
					break;
				}
			default:
				{
					super.catch(exception, host);
					break;
				}
		}
	}
}
