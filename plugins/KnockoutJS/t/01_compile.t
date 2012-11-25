use strict;
use warnings;

use FindBin qw($Bin);
use lib $Bin;

use MTPath;
use Test::More;
use MT::Plugins::Test::Template;

use_ok 'MT::KnockoutJS::Util';
use_ok 'MT::KnockoutJS::Tags';

test_template(
    template => '<mtapp:LoadKnockoutJS>',
    test => sub {
        my %args = @_;
        is $args{result}, q{
<script>(window.ko) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/knockout-2.2.0.js?v=5.2"><\/script>');</script>
<script>(window.ko && window.ko.mapping) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/knockout.mapping-latest.js?v=5.2"><\/script>');</script>
<script>(window.ko && window.ko.bindingHandlers.sortable) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/ko.sortable.js?v=5.2"><\/script>');</script>
<script>(window.jQuery.ui && window.jQuery.ui.knockoutTable) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/jquery-ui-knockout-table.js?v=5.2"><\/script>');</script>
};
    }
);

test_template(
    template => '<mtapp:LoadKnockoutJS><mtapp:LoadKnockoutJS>',
    test => sub {
        my %args = @_;
        is $args{result}, q{
<script>(window.ko) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/knockout-2.2.0.js?v=5.2"><\/script>');</script>
<script>(window.ko && window.ko.mapping) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/knockout.mapping-latest.js?v=5.2"><\/script>');</script>
<script>(window.ko && window.ko.bindingHandlers.sortable) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/ko.sortable.js?v=5.2"><\/script>');</script>
<script>(window.jQuery.ui && window.jQuery.ui.knockoutTable) || document.write('<script src="/mt/mt52/mt-static/plugins/KnockoutJS/js/jquery-ui-knockout-table.js?v=5.2"><\/script>');</script>
};
    }
);

done_testing;
