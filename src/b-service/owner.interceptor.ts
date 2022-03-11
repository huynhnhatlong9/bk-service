import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException
} from "@nestjs/common";
import { from, mergeMap, Observable } from "rxjs";
import { AuthenticatedRequest } from "src/auth/interface/authenticated-request.interface";
import { EnterprisePrincipal } from "src/auth/interface/enterprise-principal";
import { Types } from "mongoose";
import { ServiceModel } from "../database/model/service.model";
import { ENTERPRISE_MODEL, SERVICE_MODEL } from "src/database/database.constants";
import { EnterpriseModel } from "../database/model/enterprise.model";

@Injectable()
export class OwnerInterceptor implements NestInterceptor {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(ENTERPRISE_MODEL) private enterpriseModel: EnterpriseModel
    ) {
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest<EnterprisePrincipal>>();
    let enterprise = req.user.id;
    let service = req.params['idService'];
    if(!Types.ObjectId.isValid(service)){
      throw new ConflictException("Enterprise doesn't own Service!");
    }
    if(!Types.ObjectId.isValid(enterprise)){
      throw new UnauthorizedException();
    }
    return from(this.enterpriseModel.findOne({_id: Types.ObjectId(enterprise)}).exec()).pipe(
      mergeMap((e)=>{
        if(!e){
          throw new UnauthorizedException();
        }
        else{
          return from(this.serviceModel.findOne({_id: Types.ObjectId(service)}).exec()).pipe(
            mergeMap((s)=>{
              if(!s || s.enterprise!=enterprise){
                throw new ConflictException("Enterprise doesn't own Service!");
              }
              else{
                return next.handle();
              }
            })
          )
        }
      })
    )
  }
}