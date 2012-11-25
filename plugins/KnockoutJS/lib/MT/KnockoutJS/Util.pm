package MT::KnockoutJS::Util;

use strict;
use base 'Exporter';

our @EXPORT = qw(plugin);

sub plugin { MT->component('KnockoutJS') }

1;
__END__