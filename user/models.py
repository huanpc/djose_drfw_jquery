from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core import validators
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    """
    Adding some extras information
    """
    name = models.CharField(max_length=65, default=None, null=True, validators=[
            validators.RegexValidator(
                r'^[\w.@+-]+$',
                _('Enter a valid name. This value may contain only '
                  'letters, numbers ' 'and @/./+/-/_ characters.')
            ),
        ])
    address = models.CharField(max_length=65, default=None, null=True, validators=[
        validators.RegexValidator(
            r'^[\w.@+-]+$',
            _('Enter a valid name. This value may contain only '
              'letters')
        ),
    ])
    mobile_number = models.CharField(max_length=65, default=None, null=True, validators=[
        validators.RegexValidator(
            r'^[0-9]+$',
            _('Enter a valid mobile number. This value may contain only '
              'number')
        ),
    ])
    REQUIRED_FIELDS = ('name', 'address', 'mobile_number', 'email')

