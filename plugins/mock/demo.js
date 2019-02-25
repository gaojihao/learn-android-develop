const Mock = require('mockjs')
let config = require(`../../config/index`);
import utils from './utils';

Mock.mock(`${config.baseUrl}/demo/items`,'get',
    utils.success({
        'data|1-2': [{
            'name': '@name',
            'createTime': '@datetime',
        }],
        status : 200,
    })
)

// Mock.mock(`${config.baseUrl}/demo/getNoteList`,'get',
//     utils.success({
//         'data|1-10':[{
//             'id|+1':1,
//             'category':Mock.Random.ctitle( 4, 20 ),
//             'title':Mock.Random.ctitle( 20, 40 ),
//             'headImg':Mock.Random.dataImage('40x50', 'mock的图片'),
//             'name':'@name',
//             'date':'@date',
//             'star|1-200':100,
//             'isStar|1-1':true,
//             'zan|1-2000':100,
//             'isZan|1-1':true,
//             'read|1-300':333,
//             'stared|1':Mock.Random.boolean(),
//             'zaned|1':Mock.Random.boolean(),
//         }],
//         status : 200,
//     })
// )



Mock.mock(`${config.baseUrl}/activity/v1/discount/ismpc`,'get',
    utils.success({
        data:{
            'name': '@name',
            'age|1-100': 100,
            'color': '@color'
        },
        status:200
    })
)

Mock.mock(new RegExp(`${config.baseUrl}/v1/na-uis/social/UserDetail`),'get',
    utils.success({
        data:{
            'nickName': 'jackyyao',
            'realname': 'jackyyao',
            'headimg': 'http://www.baidu.com',
            'gender': 1,
            'studentNumber': '1',
            'college': '上海大学xx学院',
            'major': '15级-美术专业',
            'avatar': ""
        },
        status:200
    })
)

Mock.mock(new RegExp(`${config.baseUrl}/v1/uis/social/MemberInfo`),'get',
    utils.success({
        data: {
                "city": null,
                "fans": null,
                "followMe": null,
                "followTo": null,
                commonUser: {
                    'uid': '100',
                    'nickName': '昵称',
                    'realname': '真名',
                    'gender': 2,
                    'studentNumber': '1',
                    'college': '上海大学xx学院',
                    'major': '15级-美术专业',
                    'avatar': "",
                    "remark": null,
                    "iconType": null,
                    "blogTotal": null,
                    "fans": null,
                    "followMe": null,
                    "followTo": null
                }
            },
        status:200
    })
)

Mock.mock(new RegExp(`${config.baseUrl}/v1/na-uis/follow/MainList`),'get',
    utils.success({
        'data':{
            'isMore':true,
            'list|10': [{
                "contentId": "225673696667480064",
                "pic": {
                    "name": "http://www.163.com/picname.jpg",
                    "width": 0,
                    "height": 0
                },
                "title": "太平洋暖流-地理",
                "author": {
                    "uid": "1",
                    "nickName": "小天王",
                    "realName": "李德华",
                    "studentNumber": null,
                    "college": null,
                    "grade": null,
                    "major": null,
                    "graduate": null,
                    "avatar": "http://www.qqzhi.com/uploadpic/2015-01-13/055829545.jpg",
                    "gender": 1,
                    "remark": null,
                    "iconType": null,
                    "blogTotal": 2,
                    "fans": "7",
                    "followMe": false,
                    "followTo": false
                },
                "previewText": "欢迎见识",
                "readTotal": 9,
                "commentTotal": 8,
                "read": 9,
                "collectNum": 12,
                "likeTotal": 50,
                "likeStatus": false,
                "distance": null,
                "publishTime": "2017-07-16 17:46:42",
                "feedId": "194042631937265664",
                "feedType": "ugc",
                "feedCategory": null,
                "feedContentTags": null,
                "status": 1,
                "tabType": null,
                "isChosen": null,
                "superscript": null,
                "iconType": 1,
                "pics": [{
                    "name": require('../../assets/images/110_110.jpg'),
                    "width": 0,
                    "height": 0
                }],
                "href": null,
                "contentType": null,
                "gradeId": "11级",
                "collegeId": null,
                "majorId": "地质专业",
                "courseId": "地理",
                "isCollect": false,
                "downgrade": 0
            }]
		},
        status:200
    })
)






Mock.mock(`${config.baseUrl}/v1/mygroup`,'get',
    utils.success({
        'createdGroup|1-10':[{
            'title':'@ctitle',
            'pic':Mock.Random.dataImage('272x170', 'mock的图片'),
            'isNew|1-2':true,
            'id|+1':1
        }],
    })
)
Mock.mock(`${config.baseUrl}/v1/na-uis/feed/topic/follow`,'get',
    utils.success({
        'data|1-10':[{
          "ID|222-98864": 988,
          "blogTotal|0-999": 3,
          "content": "@ctitle",
          "cover": {
            "height": 0,
            "name": Mock.Random.dataImage('272x170', 'mock的图片'),
            "width": 0
          },
          "followTotal|0-999": 3,
          "hasNew|1-2": false,
          "id|222-98864": 988,
          "isFollow|1-2": false,
          "memberFollowTotal|0-1144":988,
          "memberTotal|0-999": 3,
          "status": 0,
          "title": "@ctitle"
        }],
    })
)
Mock.mock(`${config.baseUrl}/v1/getgrouptag`,'get',
    utils.success({
        data:{
          name:'@name',
          total:18,
          pageNum:1,
          pageSize:100,
          size:18,
          pages:1,
          'groups|1-100':[{
            'id|+1':1,
            'tagTypes':1,
            'tagDesc':Mock.Random.ctitle(1,4),
            "startTime":1525504143000,
            "endTime":1525504143000,
            "tagStatus":1
          }]
        },
    })
)
Mock.mock(`${config.baseUrl}/v1/getgrouplist`,'get',
    utils.success({
        'data|1-10':[{
            'id|+1':1,
            "blogTotal": "100",
            'cover':Mock.Random.dataImage('272x170', 'mock的图片'),
            "followTotal|1-200": 20,
            "isFollow|1-3": 2,
            "memberFollowTotal|1-200": 30,
            "memberTotal|1-200": 63,
            "status": 0,
            "ctitle": "@ctitle",
        }],
    })
),
Mock.mock(`${config.baseUrl}/v1/getGroupsSearchList`,'get',
    utils.success({
        'data|1-10':[{
            'id|+1':1,
            "blogTotal": "100",
            'cover':Mock.Random.dataImage('272x170', 'mock的图片'),
            "followTotal|1-200": 20,
            "isFollow|1-3": 2,
            "memberFollowTotal|1-200": 30,
            "memberTotal|1-200": 63,
            "status": 0,
            "ctitle": "@ctitle",
        }],
    })
)

Mock.mock(new RegExp(`${config.baseUrl}/v1/na-uis/feed/discovery`),'get',
    utils.success({
        'data':{
            'menu': [{
                'id|+1': 101,
                'name': '学习圈',
                'icon': 'https://note.youdao.com/yws/api/personal/file/WEB23c08d92362193075471679ed84754d7?method=download&shareKey=6cba1fb589ad62258e8456fd072f8607',
                'href': 'shunivapp://groups/myGroup'
            }, {
                'id|+1': 201,
                'name': '课程笔记',
                'icon': 'https://note.youdao.com/yws/api/personal/file/WEB23c08d92362193075471679ed84754d7?method=download&shareKey=6cba1fb589ad62258e8456fd072f8607',
                'href': 'shunivapp://note/notes'
            }, {
                'id|+1': 301,
                'name': '其他',
                'icon': 'https://note.youdao.com/yws/api/personal/file/WEB23c08d92362193075471679ed84754d7?method=download&shareKey=6cba1fb589ad62258e8456fd072f8607',
                'href': 'https://router.vuejs.org/zh/api/#router-forward'
            }]
        },
        status:200,
    })
)

Mock.mock(new RegExp(`${config.baseUrl}/v1/uissh/notify/isnew`),'get',
    utils.success({
        'data':{
            'id|+1': 1,
            'data': 1,
            'message': "success"
        },
        status:200,
    })
)
Mock.mock(`${config.baseUrl}/v1/na-uis/feed/topic/main`,'get',
    utils.success({
        'data':{
            "ID|1-999": 3,
            "announcement": "string",
            "blogTotal|1-999": 3,
            "content": "@ctitle",
            "cover": {
              "height": 0,
              "name": Mock.Random.dataImage('272x170', 'mock的图片'),
              "width": 0
            },
            "createTime|1-999": 3,
            "id|1-999": 3,
            "isFollow|1-2": false,
            "shareData": {
              "content": "string",
              "pic": "string",
              "title": "string",
              "url": "string"
            },
            "status": 0,
            "title": "@ctitle"
        }
    })
)
Mock.mock(`${config.baseUrl}/v1/na-uis/feed/topic/feeds`,'get',
    utils.success({
        'data':{
            "isMore|1-2": false,
            "list|1-10": [{
                "author": {
                    "avatar": Mock.Random.dataImage('272x170', 'mock的图片'),
                    "blogTotal|1-999": 3,
                    "college": "string",
                    "fans|1-999": 3,
                    "followMe|1-2": false,
                    "followTo|1-2": false,
                    "gender": 0,
                    "grade": "string",
                    "graduate": 0,
                    "iconType": 0,
                    "major": "string",
                    "nickName": "@ctitle",
                    "realname": "string",
                    "remark": "string",
                    "studentNumber": 0,
                    "uid|1-999": 3,
                },
                "collectNum": 0,
                "collegeId": "string",
                "commentTotal": 0,
                "contentId": "string",
                "contentType": "string",
                "courseId": "string",
                "distance": "string",
                "feedCategory": [
                  "string"
                ],
                "feedContentTags": [
                  "string"
                ],
                "feedId|1-999": 3,
                "feedType": "string",
                "gradeId": "string",
                "href": "string",
                "iconType": 0,
                "isChosen": false,
                "likeStatus|1-2": false,
                "likeTotal|1-999": 3,
                "majorId": "string",
                "pic": {
                  "height": 0,
                  "name": "string",
                  "width": 0
                },
                "pics|1-3": [
                  {
                    "height": 0,
                    "name":Mock.Random.dataImage('272x170', 'mock的图片'),
                    "width": 0
                  }
                ],
                "previewText": "string",
                "publishTime": "string",
                "read": 0,
                "readTotal": "string",
                "status": 0,
                "superscript": 0,
                "tabType": "string",
                "title": "@ctitle"
            }]
        },
    })
)


Mock.mock(`${config.baseUrl}/v1/getTrendsDetail`,'get',
    utils.success({
        'data':{
            'id|+1':1,
            'nickName':'@ctitle',
            'content':Mock.Random.csentence(3,100),
            'createTime':Mock.Random.datetime(),
            'isTop|1-2':false,
            'isActivity|1-2':true,
            'pic|1-3':[{
                'picImage':Mock.Random.dataImage('272x272', 'mock的图片'),
            }],
            'replyTotal|1-100':2,
            'likeTotal|1-100':4,
            'likeStatus':Mock.Random.bool(),
            'activityTime':Mock.Random.date(),
            'activityAdress':Mock.Random.ctitle(6,18),
            'userImage':Mock.Random.dataImage('272x170', 'mock的图片'),

        },
    })
)

Mock.mock(`${config.baseUrl}/v1/getComments`,'get',
    utils.success({
        'data|1-10':[{
            "ID|+1": 1,
            "blogId|+1": 2,
            "content": Mock.Random.csentence(3,100),
            "contentIcon": "string",
            "createTime": Mock.Random.date(),
            "likeStatus|1-2": false,
            "likeTotal|0-100": 0,
            "replyList|1-5": [
                  {
                    "ID|+2": 5,
                    "blogId|+3": 8,
                    "commentId": "string",
                    "content": Mock.Random.csentence(3,30),
                    "likeStatus": false,
                    "replyTime": "string",
                    "replyUser": {
                      "avatar": "string",
                      "blogTotal": 0,
                      "fans": "string",
                      "followMe": false,
                      "followTo": false,
                      "gender": 0,
                      "iconType": 0,
                      "nickName": '@ctitle',
                      "remark": "string",
                      "uid": "string"
                    },
                    "status": 0,
                    "user": {
                      "avatar": "string",
                      "blogTotal": 0,
                      "fans": "string",
                      "followMe": false,
                      "followTo": false,
                      "gender": 0,
                      "iconType": 0,
                      "nickName": '@ctitle',
                      "remark": "string",
                      "uid": "string"
                    }
                  }
            ],
            "replyTotal|3-20": 0,
            "status": 0,
            "user": {
              "avatar": "string",
              "blogTotal": 0,
              "fans": "string",
              "followMe": false,
              "followTo": false,
              "gender": 0,
              "iconType": 0,
              "nickName": "@ctitle",
              "remark": "string",
              "uid": "string"
            }
        }],

    })
)

Mock.mock(`${config.baseUrl}/v1/getSearchResult`,'get',
    utils.success({
        'data|1-10':[{
            'id|+1':1,
            "blogTotal": "100",
            'cover':Mock.Random.dataImage('272x170', 'mock的图片'),
            "followTotal|1-200": 20,
            "isFollow|1-3": 2,
            "memberFollowTotal|1-200": 30,
            "memberTotal|1-200": 63,
            "status": 0,
            "ctitle": "@ctitle",
        }],
    })
)

Mock.mock(`${config.baseUrl}/v1/na-uis/feed/search/seek`,'post',
     utils.success({
        'data|1-10':[{
            'id|+1':1,
            'nickName':'@ctitle',
            'content':Mock.Random.csentence(3,100),
            'createTime':Mock.Random.date('yyyy-mm-dd'),
            'isTop|1-2':false,
            'isActivity|1-2':true,
            'pic|1-3':[{
                'picImage':Mock.Random.dataImage('272x272', 'mock的图片'),
            }],
            'replyTotal|1-100':2,
            'likeTotal|1-100':4,
            'likeStatus':Mock.Random.bool(),
            'activityTime':Mock.Random.date(),
            'activityAdress':Mock.Random.ctitle(6,18),
            'userImage':Mock.Random.dataImage('272x170', 'mock的图片'),

        }],
    })
)



export default {
}
