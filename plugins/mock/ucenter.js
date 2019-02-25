let Mock = require('mockjs')
let config = require(`../../config/index`);
import utils from './utils';

Mock.mock(new RegExp(`${config.baseUrl}/v1/uissh/notify/list`),'get',
    utils.success({
        data: {
            total:10,
            pageNum:1,
            pageSize:10,
            size:10,
            pages:2,
            'list|10': [{
                'notifyId|+1':1,
                'title': '学习圈移除圈子通知',
                'content': "您被\"摄影\"圈主移出了圈子，快去看看把",
                'createTime': '@datetime',
                'url': ''
            }],
        },
        status : 200,
    })
)

Mock.mock(`${config.baseUrl}/jwt`,'post',
    utils.success({
        data: Mock.Random.word(32, 32),
        status : 200,
    })
)

Mock.mock(`${config.baseUrl}/ucenter/getFavNoteList`,'get',
    utils.success({
        'data|1-20':[{
            'id|+1':1,
            'category':Mock.Random.ctitle( 4, 20 ),
            'title':Mock.Random.ctitle( 20, 40 ),
            'headImg':Mock.Random.dataImage('40x50', 'mock的图片'),
            'name':'@name',
            'date':'@date',
            'star|1-200':100,
            'isStar|1-1':true,
            'zan|1-2000':100,
            'isZan|1-1':true,
            'read|1-300':333,
        }],
        status : 200,
    })
)
Mock.mock(`${config.baseUrl}/v1/na-uissh/collegeMajorCourse`,'get',
    utils.success({
        'data|10-20': [
            {
                collegeId:  Mock.Random.uuid(),
                'collegeName|+1': [
                    '理学院',
                    '体育学院',
                    '土木系',
                    '外国语学院',
                    '国际工商与管理学院',
                    '文学院',
                    '艺术研究院',
                    '生命科学学院',
                    '数码艺术学院',
                    '通信与信息工程学院'
                ],
                'majors|10-30': [
                    {
                        majorId: Mock.Random.uuid(),
                        'majorName|+1': [
                            '计算机科学与技术',
                            '经济学类',
                            '通信工程',
                            '社会学',
                            '法学',
                            '金融学',
                            '机械工程及自动化',
                            '电子信息工程',
                            '数学与应用数学',
                        ],
                        'courses|10-30': [
                            {
                                courseId: Mock.Random.uuid(),
                                'courseName|+1': [
                                    '高等数学专业',
                                    '近世代数',
                                    '数值方法',
                                    '统计学',
                                    '线性代数'
                                ]

                            }
                        ]
                    }
                ]
            }
        ],
        status : 200,
    })
)

export default {
}
