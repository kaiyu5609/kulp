const $ = require('jquery');

// ajax对返回的原始数据进行预处理
function defaultDataFilter(data, type) {
    return data;
}

function transformData(contentType, data) {
    if (contentType.indexOf('json') > -1) {
        return JSON.stringify(data);
    }
    return data;
}

function Request(settings) {
    var _settings = {
        url: settings.url,
        data: settings.data,
        timeout: settings.timeout || 120000,
        format: settings.format || defaultDataFilter,
        contentType: settings.contentType || 'application/json'
    };

    return {
        _convert: function(opts) {
            var contentType = settings.contentType || 'application/json';
            var defer = $.Deferred();
            var ajaxSettings = {
                url: _settings.url,
                type: opts.type,
                data: transformData(_settings.contentType, opts.data),
                async: true,
                // cache: true,
                timeout: _settings.timeout,
                // contentType: 'application/x-www-form-urlencoded',
                contentType: _settings.contentType,
                dataType: "json",
                beforeSend: function(xhr) {},
                complete: function(xhr, textStatus) {
                    // 调用本次ajax请求时传递的options参数
                },
                error: function(xhr) {}
            };

            $.ajax(ajaxSettings)
            .done(function(res) {
                if (res.success === true) {
                    defer.resolve(res);
                } else {
                    // Logger.error(res);
                    defer.reject(res);
                }
            })
            .fail(function(xhr) {
                var response;
                if (xhr.responseText) {
                    try {
                        response = JSON.parse(xhr.responseText);
                    } catch (e) {
                        response = { errorCode: xhr.status, data: null, message: xhr.responseText };
                    }
                } else {
                    response = { errorCode: xhr.status, data: null, message: '系统处理错误，请稍候再试！'};
                }

                if (xhr.statusText === 'timeout' && xhr.status === 0) {
                    response.message = '请求超时，请稍候再试！';
                    defer.reject(response);
                } else {
                    defer.reject(response);
                }
            });

            return defer.promise();
        },
        get: function() {
            return this._convert({
                type: 'GET'
            });
        },
        post: function(data) {
            return this._convert({
                type: 'POST',
                data: data || _settings.data
            });
        },
        put: function(data) {
            return this._convert({
                type: 'PUT',
                data: data || _settings.data
            });
        },
        delete: function(data) {
            return this._convert({
                type: 'DELETE',
                data: data || _settings.data
            });
        }

    };

}

Request.Deferred = function() {
    return $.Deferred();
};

Request.reject = function() {
    var defer = $.Deferred();
    defer.reject(arguments);
    return defer;
};

Request.when = function() {
    return $.when.apply($, arguments);
};

Request.step = function(queue) {
    var defer = $.Deferred(),
        p, next;

    defer.resolve();

    while (queue.length > 0 && (p = queue.shift())) {
        next = next ? next.pipe(p) : defer.pipe(p);
    }

    return next;
};

module.exports = Request;