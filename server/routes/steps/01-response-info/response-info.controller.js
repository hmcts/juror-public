;(function () {
  'use strict';

  const responseInfoIds = [
    'jury-service',
    'employment',
    'change-dates',
  ];

  module.exports.index = (app) => (req, res) => {
    const { id } = req.params;

    if (!id || !responseInfoIds.includes(id) || req.session.user?.digitalByDefault !== true) {
      return res.redirect(app.namedRoutes.build('steps.responder.type.get'));
    }

    const backLinkUrl = 'steps.response-start.get';

    const responseStartRoute = req.session.user?.thirdParty === 'Yes'
      ? 'branches.third.party.details.name.get'
      : 'steps.your.details.get';

    return res.render(`steps/01-response-info/${id}.njk`, {
      user: req.session.user,
      responseStartUrl: app.namedRoutes.build(responseStartRoute),
      backLinkUrl,
    });
  };

})();
