import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '@app/common';

const getCurrentUserByContext = (context: ExecutionContext): Users => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
