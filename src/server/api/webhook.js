// module
var url = require('../services/url');
var github = require('../services/github');

function createRepoHook(req, done) {
    github.call({
        obj: 'repos',
        fun: 'createHook',
        arg: {
            user: req.args.owner,
            repo: req.args.repo,
            name: 'web',
            config: { url: url.webhook(req.args.repo), content_type: 'json' },
            events: ['pull_request'],
            active: true
        },
        token: req.user.token
    }, done);
}

function createOrgHook(req, done) {
    var args = {
        url: url.githubOrgWebhook(req.args.org),
        token: req.user.token,
        http_method: 'POST',
        body: {
            name: 'web',
            config: { url: url.webhook(req.args.org), content_type: 'json' },
            events: ['pull_request'],
            active: true
        }
    };
    console.log(args);
    github.direct_call(args, done);
}

function extractGithubArgs(args) {
    var obj = args.org ? 'orgs' : 'repos';
    var arg = args.org ? {
        org: args.org
    } : {
        user: args.user,
        repo: args.repo
        };
    return { obj: obj, arg: arg };
}

module.exports = {

    get: function (req, done) {
        var githubArgs = extractGithubArgs(req.args);

        github.call({
            obj: githubArgs.obj,
            fun: 'getHooks',
            arg: githubArgs.arg,
            token: req.user.token
        }, function callback(err, hooks) {
            var hook = null;

            if (!err) {
                hooks.forEach(function (webhook) {
                    if (webhook.config.url && webhook.config.url.indexOf(url.baseWebhook) > -1) {
                        hook = webhook;
                    }
                });
            }
            done(err, hook);
        });
        // now we will have to check two things:
        // 1) webhook user still has push access to this repo
        // 2) token is still valid
        // -> if one of these conditions is not met we will
        //    delete the webhook

        // if(hook) {

        // }

    },

    create: function (req, done) {
        return req.args && req.args.orgId ? createOrgHook(req, done) : createRepoHook(req, done);
    },

    remove: function (req, done) {
        this.get(req, function (err, hook) {
            if (err || !hook) {
                done(err || 'No webhook found with base url ' + url.baseWebhook);
                return;
            }
            var githubArgs = extractGithubArgs(req.args);
            githubArgs.arg.id = hook.id;

            github.call({
                obj: githubArgs.obj,
                fun: 'deleteHook',
                arg: githubArgs.arg,
                token: req.user.token
            }, done);
        });

    }
};
