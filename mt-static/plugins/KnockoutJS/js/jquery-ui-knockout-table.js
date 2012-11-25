// Generated by CoffeeScript PHP 1.3.1
(function() {

  jQuery.widget('ui.knockoutTable', {
    options: {
      applyTo: null,
      columns: null,
      sortable: true,
      autoSerialize: true,
      defaults: {},
      viewModelCreated: null,
      rowCreated: null
    },
    _create: function() {
      var json, options, viewModel, widget,
        _this = this;
      widget = this;
      this.input = this.element;
      this.$input = jQuery(this.input);
      options = this.options;
      json = this.$input.val();
      if (json !== '') {
        json = JSON.parse(json);
        if (typeof json.rows === 'string') {
          json.rows = JSON.parse(json.rows);
        }
      } else {
        json = {
          rows: []
        };
      }
      if (options.applyTo === null) {
        options.applyTo = this.$input.attr('data-apply-to');
      }
      this.$applyTo = jQuery(options.applyTo);
      this.$applyTo.find('input,textarea,select').each(function(i, el) {
        var name;
        name = jQuery(el).attr('name');
        if ((name != null) && options.defaults[name] === void 0) {
          return options.defaults[name] = jQuery(el).val();
        }
      });
      this.viewModel = viewModel = ko.mapping.fromJS(json);
      console.log(this.viewModel.rows());
      viewModel._rowCreated = function(row) {
        if (options.rowCreated != null) {
          return options.rowCreated.call(viewModel, row);
        }
      };
      viewModel._add = function() {
        var row;
        row = ko.mapping.fromJS(options.defaults);
        viewModel.rows.push(row);
        return viewModel._rowCreated(row);
      };
      viewModel._copy = function(row, ev) {
        var copied, idx;
        idx = viewModel.rows.indexOf(row);
        if (idx >= 0) {
          json = ko.mapping.toJS(row);
          copied = ko.mapping.fromJS(json);
          viewModel.rows.splice(idx + 1, 0, copied);
          return viewModel._rowCreated(copied);
        }
      };
      viewModel._remove = function(row, ev) {
        return viewModel.rows.remove(row);
      };
      viewModel._serialize = function() {
        return widget.serialize();
      };
      if (options.viewModelCreated != null) {
        options.viewModelCreated.call(viewModel, options);
      }
      ko.applyBindings(viewModel, this.$applyTo.get(0));
      if (options.autoSerialize === true) {
        this.$input.closest('form').submit(function() {
          widget.freeze();
          return widget.serialize();
        });
      }
      return this;
    },
    freeze: function() {
      this.$applyTo.find('input,textarea,select').attr('disabled', 'disabled');
      return this;
    },
    serialize: function() {
      var json;
      json = ko.mapping.toJS(this.viewModel);
      this.$input.val(JSON.stringify(json));
      return this;
    }
  });

}).call(this);
