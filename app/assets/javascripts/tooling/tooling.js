var tooling = function() {
  var popover_caller;
  var state;

  var attach = function() {
    attach_to('skills-planned');
    attach_dropdown_event();
  }

  var attach_dropdown_event = function() {
    $('button.dropdown-tool').on('click', function() {
      hide_popover();
      skill_popup.hide();
    })
  }

  var attach_to = function(target) {
    attach_object('tool-separator', target);
    attach_object('tool-stat-planner', target);
    attach_object('tool-checkin-marker', target);
    attach_object('tool-profession-planner', target);
  }

  var attach_object = function(type, target) {
    $('#' + type).on('click', function(event) {
      var cloned = $('#' + type + '-base').clone(true, true);
      cloned.removeAttr('id').appendTo('#' + target);
      activate(cloned);
      event.preventDefault();
    })
  }

  var activate = function(obj) {
    obj.find('.glyphicon-arrow-down').on('click', function() {
      move($(this).parent(), 'down');
    })

    obj.find('.glyphicon-arrow-up').on('click', function() {
      move($(this).parent(), 'up');
    })

    obj.find('.glyphicon-refresh').on('click', function() {
      alternate($(this).parent());
    })

    obj.find('.glyphicon-minus').on('click', function() {
      adjust($(this).parent(), -1);
    })

    obj.find('.glyphicon-plus').on('click', function() {
      adjust($(this).parent(), 1);
    })

    // $('.tool').find('.glyphicon-option-horizontal').on('click', function() {
    //   more_options($(this));
    // })

    obj.find('.tool-editable').editable({
      type: 'text',
      unsavedclass: null
    }).on('shown', function() {
      hide_popover();
    })

    $.each(obj.find('.glyphicon-option-horizontal'), function() {
      more_options($(this));
      $(this).on('click', function() {
        if (popover_caller != null) {
          popover_caller.popover('hide');
        }
        popover_caller = $(this);
        popover_caller.popover('toggle');
      })
    })

    obj.on('click', function() {
      dragdrop.drop($(this));
    })
  }

  var adjust = function(obj, value) {
    hide_popover();
    var target = obj.find('.tool-text');
    var current_value = parseInt(target.text());

    if (value == -1) {
      if (current_value == 0) return;
    } 

    target.text(current_value + value);
  }

  var alternate = function(obj) {
    hide_popover();
    var target = obj.find('.tool-option');

    if (target.text() == 'HP') {
      target.text('MP');
    } else if (target.text() == 'MP') {
      target.text('HP');
    }
  }

  var find_end_of_group_from = function(obj) {
    console.log('running search from');
    console.log(obj);
    var current_obj = obj.next();
    var prev_obj = obj;

    while (current_obj.length > 0) {
      console.log('iterating');
      console.log(current_obj);
      if (is_group(current_obj)) {
        console.log('returning because found group');
        return prev_obj;
      }

      prev_obj = current_obj;
      current_obj = current_obj.next();
    }

    console.log('returning because no more siblings');
    return prev_obj;
  }

  var move = function(obj, direction) {
    var objs = new Array();
    hide_popover();
    var anchor;

    if (is_group(obj)) {
      var maybe_anchor;
      if (direction == 'up') {
        maybe_anchor = obj.prev();
      } else if (direction == 'down') {
        maybe_anchor = obj.next();
      }

      while (maybe_anchor.length > 0) {
        if (is_group(maybe_anchor)) {
          if (direction == 'down') {
            anchor = find_end_of_group_from(maybe_anchor);
          } else if (direction == 'up') {
            anchor = maybe_anchor;
          }
          break;
        }
        if (direction == 'up') {
          maybe_anchor = maybe_anchor.prev();
        } else if (direction == 'down') {
          maybe_anchor = maybe_anchor.next();
        }
      }
    } else {
      if (direction == 'up') {
        anchor = obj.prev();
      } else if (direction == 'down') {
        anchor = obj.next();
      }
    }

    console.log(anchor);
    if (anchor == null) return;

    objs.push(obj);

    if (is_group(obj)) {
      var current_obj = obj.next();
     
      while (current_obj.length > 0) {
        if (is_group(current_obj)) break;
        objs.push(current_obj);
        current_obj = current_obj.next();
      } 
    }

    console.log('objects to move around: ');
    console.log(objs);

    var ordered = objs;

    if (direction == 'down') {
      ordered = ordered.reverse();
    }

    $.each(objs, function(i, x) {
      if (direction == 'up') { x.insertBefore(anchor); }
      else if (direction == 'down') { x.insertAfter(anchor); }
    })
  }

  var more_options = function(obj) {
    obj.popover({
      trigger: 'manual',
      html: true,
      content: generate_more_options(obj),
      placement: 'top'
    }).on('shown.bs.popover', function() {
      apply_popover_interactivity();
    })
  }

  var apply_popover_interactivity = function() {
    var popover = $('.popover');
    popover.find('.glyphicon').parent().css('cursor', 'pointer');

    attach_more_options_apply(popover.find('.glyphicon-ok'));
  }

  var attach_more_options_apply = function(obj) {
  }

  var is_group = function(obj) {
    return obj.hasClass('tool-separator');
  }

  var hide_popover = function() {
    if (popover_caller == null) return;
    popover_caller.popover('hide');
  }

  var generate_more_options = function(obj) {
    var s = '';
    s += '<div><span class="glyphicon glyphicon-ok"></span> Apply</div>';
    s += '<div><span class="glyphicon glyphicon-remove"></span> Remove</div>';

    return s;
  }

  return {
    attach: attach
  }
}()