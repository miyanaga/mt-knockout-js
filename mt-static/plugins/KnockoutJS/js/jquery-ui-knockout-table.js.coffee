jQuery.widget 'ui.knockoutTable',
    options:
        applyTo: null
        columns: null
        sortable: true
        autoSerialize: true
        defaults: {}
        viewModelCreated: null
        rowCreated: null

    _create: ->
        widget = @

        # input element
        @input = @element
        @$input = jQuery(@input)
        options = @options

        # Parse value as json
        json = @$input.val()
        if json isnt ''
            json = JSON.parse json
            if typeof json.rows is 'string'
                json.rows = JSON.parse json.rows
        else
            json = { rows: [] }

        # element apply to
        if options.applyTo is null
            options.applyTo = @$input.attr('data-apply-to')
        @$applyTo = jQuery(options.applyTo)

        # Fill undefined defaults
        @$applyTo.find('input,textarea,select').each (i, el) ->
            name = jQuery(el).attr('name')
            if name? and options.defaults[name] is undefined
                options.defaults[name] = jQuery(el).val()

        # View model
        @viewModel = viewModel = ko.mapping.fromJS(json)
        console.log(@viewModel.rows());

        viewModel._rowCreated = (row) ->
            if options.rowCreated?
                options.rowCreated.call viewModel, row

        viewModel._add = ->
            row = ko.mapping.fromJS(options.defaults)
            viewModel.rows.push row
            viewModel._rowCreated row

        viewModel._copy = (row, ev) ->
            idx = viewModel.rows.indexOf row
            if idx >= 0
                json = ko.mapping.toJS row
                copied = ko.mapping.fromJS json
                viewModel.rows.splice idx + 1, 0, copied
                viewModel._rowCreated copied

        viewModel._remove = (row, ev) ->
            viewModel.rows.remove row

        viewModel._serialize = =>
            widget.serialize()

        if options.viewModelCreated?
            options.viewModelCreated.call viewModel, options

        ko.applyBindings viewModel, @$applyTo.get(0)

        if options.autoSerialize is true
            @$input.closest('form').submit =>
                widget.freeze()
                widget.serialize()

        @

    freeze: ->
        @$applyTo.find('input,textarea,select').attr('disabled', 'disabled')
        @

    serialize: ->
        json = ko.mapping.toJS(@viewModel)
        @$input.val(JSON.stringify json)
        @

