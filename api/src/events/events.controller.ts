import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EventDomain as Event } from './domain/event';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { AddParticipantsDto } from './dto/add-participant.dto';
import { CheckConflictDTO } from './dto/check-conflict.dto';
import { RolesGuard } from '@/utils/shared/roles.guard';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'events',
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Event,
    description: 'Event successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Event),
    description: 'Successfully retrieved a paginated list of events.',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  async findAll(
    @Query() query: FindAllEventsDto,
  ): Promise<InfinityPaginationResponseDto<Event>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.eventsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('/me')
  @ApiOkResponse({
    type: InfinityPaginationResponse(Event),
    description: 'Successfully retrieved events for the current user.',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters.' })
  async findAllMyEvents(
    @Query() query: FindAllEventsDto,
  ): Promise<InfinityPaginationResponseDto<Event>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.eventsService.findAllWithPagination(
        {
          paginationOptions: {
            page,
            limit,
          },
        },
        true,
      ),
      { page, limit },
    );
  }

  @Patch(':eventId/participants')
  @ApiParam({
    name: 'eventId',
    type: Number,
    description: 'The ID of the event',
    required: true,
  })
  @ApiOkResponse({
    description: 'Successfully added participants to the event.',
    type: Event,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  addParticipant(
    @Param('eventId') eventId: number,
    @Body() addParticipantsDto: AddParticipantsDto,
  ) {
    return this.eventsService.addParticipant(
      eventId,
      addParticipantsDto.participants,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the event.',
    type: Event,
  })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  findById(@Param('id') id: number) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    description: 'Successfully updated the event.',
    type: Event,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    await this.eventsService.checkPermissionToModify(id);
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiNoContentResponse({
    description: 'Successfully deleted the event.',
  })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.eventsService.checkPermissionToDelete(id);
    return this.eventsService.remove(id);
  }

  @Post('/checkConflicts')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Payload to check schedule conflicts',
    schema: {
      type: 'object',
      properties: {
        userIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 3, 4],
        },
        startTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-01-11T07:00:00.000Z',
        },
        endTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-01-11T16:00:00.000Z',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Schedule conflicts detected successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'number', example: 1 },
          conflicts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: 'Retro sprint 2' },
                startTime: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-11T07:00:00.000Z',
                },
                endTime: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-11T16:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async checkConflicts(@Body() checkConflitsDto: CheckConflictDTO) {
    return this.eventsService.detectScheduleConflicts(checkConflitsDto);
  }
}
