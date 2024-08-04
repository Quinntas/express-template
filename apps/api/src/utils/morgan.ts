import morgan, {StreamOptions} from 'morgan';
import Winston from './winston';

const stream: StreamOptions = {
    write: (message: any) => Winston.http(message),
};

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {stream});

export {morganMiddleware};
