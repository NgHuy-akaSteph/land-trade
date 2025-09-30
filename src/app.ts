import express, {Request, Response, Express} from 'express'
import path from 'path'



const app: Express = express();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Real Estate Server is running!');
});

module.exports = app