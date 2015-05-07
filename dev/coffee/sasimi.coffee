class SandboxLayer
  constructor: (original) ->
    @history = activeDocument.historyStates.length
    @layer = original.duplicate()
    @angle = 0

  reset_rotate: (angle) ->
    @layer.rotate (-@angle + angle)
    @angle = angle

  rotate: (angle) ->
    @layer.rotate angle
    @angle += angle

  destroy: ->
    activeDocument.activeHistoryState = activeDocument.historyStates[@history - 1]

find_targets = (layerSet) ->
  if layerSet.typename != 'LayerSet'
    return [layerSet]

  a = for layer in layerSet.artLayers when layer.visible
    layer
  for set in layerSet.layerSets when set.visible
    a = a.concat(find_targets(set))
  a

main = ->
  targets = find_targets(app.activeDocument.activeLayer)
  for target in targets
    run(target)

run = (target) ->
  copy = new SandboxLayer(target)
  range = test(copy, [0, 90], 30) # 3
  range = test(copy, range, 10) # 3
  range = test(copy, range, 2) # 5
  range = test(copy, range, 0.5) # 4
  range = test(copy, range, 0.1) # 5
  copy.destroy()

  pass = for i in [-360, -270, -180, -90, 0, 90, 180, 270, 360]
    range[0] + i
  pass.sort (a, b) -> Math.abs(a) - Math.abs(b)
  target.rotate pass[0]

test = (target, start_end, d) ->
  start = start_end[0]
  end = start_end[1]

  target.reset_rotate(start)

  memo = []
  for i in [0..(end-start)/d]
    target.rotate d if i > 0
    bounds = target.layer.bounds
    memo.push(
      {
        angle: start + d*i
        score: (bounds[2] - bounds[0]).value * (bounds[3] - bounds[1]).value
        width: (bounds[2] - bounds[0]).value
        height: (bounds[3] - bounds[1]).value
      }
    )
  memo.sort (a, b) -> a.score - b.score
  [memo[0].angle - d/2, memo[0].angle + d/2]

main()
