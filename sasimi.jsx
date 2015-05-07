// Generated by CoffeeScript 1.9.1
(function() {
  var SandboxLayer, find_targets, main, run, test;

  SandboxLayer = (function() {
    function SandboxLayer(original) {
      this.history = activeDocument.historyStates.length;
      this.layer = original.duplicate();
      this.angle = 0;
    }

    SandboxLayer.prototype.reset_rotate = function(angle) {
      this.layer.rotate(-this.angle + angle);
      return this.angle = angle;
    };

    SandboxLayer.prototype.rotate = function(angle) {
      this.layer.rotate(angle);
      return this.angle += angle;
    };

    SandboxLayer.prototype.destroy = function() {
      return activeDocument.activeHistoryState = activeDocument.historyStates[this.history - 1];
    };

    return SandboxLayer;

  })();

  find_targets = function(layerSet) {
    var a, j, layer, len, ref, set;
    if (layerSet.typename !== 'LayerSet') {
      return [layerSet];
    }
    a = (function() {
      var j, len, ref, results;
      ref = layerSet.artLayers;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        layer = ref[j];
        if (layer.visible) {
          results.push(layer);
        }
      }
      return results;
    })();
    ref = layerSet.layerSets;
    for (j = 0, len = ref.length; j < len; j++) {
      set = ref[j];
      if (set.visible) {
        a = a.concat(find_targets(set));
      }
    }
    return a;
  };

  main = function() {
    var j, len, results, target, targets;
    targets = find_targets(app.activeDocument.activeLayer);
    results = [];
    for (j = 0, len = targets.length; j < len; j++) {
      target = targets[j];
      results.push(run(target));
    }
    return results;
  };

  run = function(target) {
    var copy, i, pass, range;
    copy = new SandboxLayer(target);
    range = test(copy, [0, 90], 30);
    range = test(copy, range, 10);
    range = test(copy, range, 2);
    range = test(copy, range, 0.5);
    range = test(copy, range, 0.1);
    copy.destroy();
    pass = (function() {
      var j, len, ref, results;
      ref = [-360, -270, -180, -90, 0, 90, 180, 270, 360];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(range[0] + i);
      }
      return results;
    })();
    pass.sort(function(a, b) {
      return Math.abs(a) - Math.abs(b);
    });
    return target.rotate(pass[0]);
  };

  test = function(target, start_end, d) {
    var bounds, end, i, j, memo, ref, start;
    start = start_end[0];
    end = start_end[1];
    target.reset_rotate(start);
    memo = [];
    for (i = j = 0, ref = (end - start) / d; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      if (i > 0) {
        target.rotate(d);
      }
      bounds = target.layer.bounds;
      memo.push({
        angle: start + d * i,
        score: (bounds[2] - bounds[0]).value * (bounds[3] - bounds[1]).value,
        width: (bounds[2] - bounds[0]).value,
        height: (bounds[3] - bounds[1]).value
      });
    }
    memo.sort(function(a, b) {
      return a.score - b.score;
    });
    return [memo[0].angle - d / 2, memo[0].angle + d / 2];
  };

  main();

}).call(this);
