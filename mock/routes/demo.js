
const utils = require('./utils');
const Mock = require('mockjs')
const {Router} = require('express')
const router = Router()

const items = [{
    name: 'Test1',
    createTime: new Date()
}, {
    name: 'Test2',
    createTime: new Date()
}, {
    name: 'Test6',
    createTime: new Date()
}]

router.get('/demo/items', (req, res, next) => {
    res.json(Mock.mock(
        utils.success({
        'data|1-10':[{
            'name': '@name',
            'createTime': '@datetime',
        }],
        'status': 200
        }
    )));
})

router.get('/demo/getNoteList', (req, res, next) => {
    res.json(Mock.mock(utils.success({
        'data|1-10':[{
            'id|+1':1,
            'category':Mock.Random.ctitle( 4, 20 ),
            'title':Mock.Random.ctitle( 20, 40 ),
            'headImg':Mock.Random.dataImage('40x50', 'mock的图片'),
            'name':'@name',
            'date':'@datetime',
            'star|1-200':100,
            'zan|1-2000':100,
            'read|1-300':333,
        }],
        'status': 200
    })));
})

// router.get('/demo/getNoteDetail', (req, res, next) => {
//     res.json(Mock.mock(utils.success({
//         'data':{
//             'id':1,
//             'title':'细胞的分裂-生物',
//             'content':'细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。细胞分裂(cell division) 是活细胞增值其数目一个细胞分裂为两个细胞的过程。分裂前的细胞称母细胞，分裂后形成的信息报称子细胞。\
//             一般包括细胞和分裂和细胞质分裂两部。',
//             'issuedTime':'2018-6-28',
//             'readcound':'333',
//             'writerUserinfo':{
//               'id':'123456',
//               'username':'管理员'
//             }
//         },
//         'status': 200
//     })));
// })


router.get('/demo/items/:id', (req, res, next) => {
    const id = parseInt(req.params.id)
    if (id >= 0 && id < items.length) {
        res.json(items[id])
    } else {
        res.sendStatus(404)
    }
})

module.exports = router
