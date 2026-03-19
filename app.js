var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

require('dotenv').config()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminArticlesRouter = require('./routes/admin/articles')
const adminCategoriesRouter = require('./routes/admin/categories')
const adminSettingsRouter = require('./routes/admin/settings')
const adminUsersRouter = require('./routes/admin/users')
const adminCoursesRouter = require('./routes/admin/courses')
const adminChaptersRouter = require('./routes/admin/chapters')
const adminCharsRouter = require('./routes/admin/chars')
const adminAuthRouter = require('./routes/admin/auth')

const frontCategoriesRouter = require('./routes/categories')
const frontCoursesRouter = require('./routes/courses')
const frontChapterRouter = require('./routes/chapters')
const frontArticleRouter = require('./routes/articles')
const frontSettingsRouter = require('./routes/setting')
const frontSearchRouter = require('./routes/search')
const frontAuthRouter = require('./routes/auth')
const frontLikesRouter = require('./routes/likes')

const adminAuth = require('./middlewares/admin-auth')
const userAuth = require('./middlewares/user-auth')



var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userAuth, usersRouter);
app.use('/admin/articles', adminAuth, adminArticlesRouter)
app.use('/admin/categories', adminAuth, adminCategoriesRouter)
app.use('/admin/settings', adminAuth, adminSettingsRouter)
app.use('/admin/users', adminAuth, adminUsersRouter)
app.use('/admin/courses', adminAuth, adminCoursesRouter)
app.use('/admin/chapters', adminAuth, adminChaptersRouter)
app.use('/admin/chars', adminAuth, adminCharsRouter)
app.use('/admin/auth', adminAuthRouter)

app.use('/categories', frontCategoriesRouter)
app.use('/courses', frontCoursesRouter)
app.use('/chapter', frontChapterRouter)
app.use('/articles', frontArticleRouter)
app.use('/settings', frontSettingsRouter)
app.use('/search', frontSearchRouter)
app.use('/auth', frontAuthRouter)
app.use('/likes', userAuth, frontLikesRouter)

module.exports = app;
