import { HttpRequest } from '@azure/functions'
import { CallbackFunction } from './Context'

export default interface Handler {
    (callback: CallbackFunction, req: HttpRequest): Promise<any>;
}