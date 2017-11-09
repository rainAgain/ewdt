const $fs = global.elRequire('fs');

var logger = global.elRequire('tracer').console({
	transport : function(data) {
		console.log(data.output);
		$fs.open('./edwt.log', 'a', parseInt('0644', 8), function(e, id) {
			$fs.write(id, data.output+"\n", null, 'utf8', function() {
				$fs.close(id, function() {
				});
			});
		});
	}
});

export function logFile(info) {
    console.log(info)
    return logger.info(info);
}