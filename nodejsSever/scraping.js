var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var express = require('express');
var app = express();

app.listen(3000, function() {
	console.log('app listening on port 3000!');
});

app.get('/parsing', function(req, res) {
	var url = 'http://www.ikaraoke.kr/isong/search_musictitle.asp?sch_sel=2&sch_txt=' + req.query.search;
	
	var requestOptions = {
			method : "POST",
			uri : url,
			form : {},
			headers : {
				'Content-Type' : 'content=text/html; charset=euc-kr'
			},
			encoding : null
		};
	
	// request 모듈을 이용하여 html 요청
	var par = request(requestOptions, function(error, response, html) {
		// 전달받은 결과를 EUC-KR로 디코딩하여 출력한다.
		var strContents = new Buffer(html);
		var parsing = iconv.decode(strContents, 'EUC-KR').toString()

		$ = cheerio.load(parsing);

		info_list = []
		info_href = []

		$('.tbl_board').first().find('tbody').each(function(index, elem) {
			
			$(this).find('.ac a').parent().parent().find('td').each(function(index, elem) {
				if ((index % 6 == 1) || (index % 6 == 2)) {
					info_list.push($(this).text().trim())
				}
			})

			$(this).find('.ac a').each(function(index, elem) {
				info_href.push($(this).attr("href"))
				info_href.push("home")
			})
		})

		var tr = [];
		var list = {};
//		check_jp = /[\u3040-\u30ff\u31f0-\u31ff]/;
//		check_oth = /[\u4E00-\u9FD5]/;
		for (var i = 0; i < info_list.length; i += 2) {
//			if ((check_jp.test(info_list[i])) || (check_oth.test(info_list[i]))) {
//				info_list.splice(i,1)
//				info_list.splice(i,1)
//				i-=2
//				continue
//			} else if ((check_jp.test(info_list[i+1])) || (check_oth.test(info_list[i+1]))) {
//				info_list.splice(i,1)
//				info_list.splice(i-1,1)
//				i-=2
//				continue
//			}
//			
			var parsing_data = {}
			parsing_data.url = info_href[i]
			parsing_data.title = info_list[i]
			parsing_data.singer = info_list[i+1]
			tr.push(parsing_data)
		}
		
		list.tr = tr
		res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
        res.send(list)
		console.log(list)
	});
});
