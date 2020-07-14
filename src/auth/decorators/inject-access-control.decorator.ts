import { Inject } from '@nestjs/common';
import { ACCESS_CONTROL } from '../../app.constants';

/**
 * Injects the `AccessControl` module instance into the provider.
 */
export const InjectAccessControl = () => Inject(ACCESS_CONTROL);
