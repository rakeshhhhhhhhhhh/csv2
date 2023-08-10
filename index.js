var CsvService = require("ya-csv");

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.upload = function(req, res){
	res.render('upload', { title: 'Upload your file' });
};

var readCsv = function (filepath) {
	var self = this;
	this.content = [];

	this.reader = CsvService.createCsvFileReader(filepath, {
        'separator': ',',
        'quote': '"',
        'escape': '"',  
        'comment': '',
        'columnsFromHeader': true
    });

    this.reader.on('data', function(data) {
	    self.content.push(data);
	});

	return self;
};

exports.uploaded =  function(req, res) {
	var fone = req.files.fone,
		ftwo = req.files.ftwo;

	if(fone.size <= 0 || ftwo.size <= 0){
		return res.send('you must upload two files');
	}

	if(fone.type != 'text/csv' || ftwo.type != 'text/csv'){
		return res.send('files must be of csv format');
	}

	var foneReader = new readCsv(fone.path),
		ftwoReader = new readCsv(ftwo.path);

	foneReader.reader.on('end', function () {
		console.log(foneReader.content.length);
		res.json(foneReader.content);
	});

	ftwoReader.reader.on('end', function () {
		console.log(ftwoReader.content.length);
	});
};