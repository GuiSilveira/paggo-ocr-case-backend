import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, { email, name, password, role }: UpdatePutUserDTO) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
        password,
        role: role ? role : 1,
      },
    });
  }

  async updatePartial(
    id: number,
    { email, name, password, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);

    const data = {
      role,
      name,
      password,
      email,
    };

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();

      data.password = await bcrypt.hash(password, salt);
    }

    if (role) {
      data.role = role;
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    const user = await this.findOne(id);

    return !!user;
  }
}
