const topLevelInteraction = (shop) => {
  return `(function() {
      function setUpTopLevelInteraction() {
        var TopLevelInteraction = new ITPHelper({
          redirectUrl: "/auth?shop=${encodeURIComponent(shop)}",
        });
        TopLevelInteraction.execute();
      }
      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);
    })();`;
};

export default topLevelInteraction;
