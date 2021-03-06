import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { AppService } from './app.service';
import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/upload/:name')
  getImage(@Res() res: Response, @Param('name') name: string) {
    return res.sendFile(name, {root: "./upload"});
  }
}
