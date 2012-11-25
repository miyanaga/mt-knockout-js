package MT::KnockoutJS::Tags;

use strict;
use MT::Util qw(caturl);
use MT::KnockoutJS::Util;

sub hdlr_appLoadKnockoutJS {
    my ( $ctx, $args, $cond ) = @_;
    return '' if $ctx->stash('__knockoutjs');

    my @scripts = (
        { src => 'js/knockout-2.2.0.js', req => 'window.ko' },
        { src => 'js/knockout.mapping-latest.js', req => 'window.ko && window.ko.mapping' },
        { src => 'js/ko.sortable.js', req => 'window.ko && window.ko.bindingHandlers.sortable'},
        { src => 'js/jquery-ui-knockout-table.js', req => 'window.jQuery.ui && window.jQuery.ui.knockoutTable' },
    );

    my $base = caturl( MT->instance->static_path, plugin->envelope);
    my $suffix = '?v=' . MT->version_id;

    my $out = "\n";
    for my $s ( @scripts ) {
        my $src = caturl($base, $s->{src}) . $suffix;
        my $req = $s->{req};

        my $tag = join '',
            q{<script>(}, $req, q{) || document.write('},
                q{<script src="}, $src, q{"><\/script>},
            q{');</script>};

        $out .= $tag . "\n";
    }

    $ctx->stash('__knockoutjs', 1);

    $out;
}

1;
__END__