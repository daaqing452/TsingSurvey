"""TsingSurvey URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from SUser.views import *
from Survey.views import *
from Analysis.views import *
import TsingSurvey.settings as settings

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', index),
    url(r'^login/$', login),
    url(r'^logout/$', logout),
    url(r'^index/$', index),
    url(r'^user_list/$', user_list),
    url(r'^sample_list/$', sample_list),
    url(r'^admin_list/$', admin_list),
    url(r'^profile/(\d{1,10})/$', profile),

    url(r'^survey/(\d{1,10})/$', survey),
    url(r'^report/(\d{1,10})/$', report),
    url(r'^survey_status/(\d{1,10})/$$', survey_status),

    url(r'^bonus/', bonus),
    url(r'^upload_file/', upload_file),
    url(r'^uploadFile/$', uploadFile),
    url(r'^search/$', search),

    url(r'^prize/$', prize),
    url(r'^prize_ticket/([p,u])/(\d{1,10})/$', prize_ticket),
    url(r'^prize_add/$', prize_add),
    url(r'^prize_add_store/$', prize_add_store),
    url(r'^prize_exchange/(\d{1,10})/$', prize_exchange),
    url(r'^prize_store/$', prize_store),
    url(r'^help_center/$', help_center),
    url(r'^tip/(\d{1,10})/$', tip),

    url(r'^backend_admin/$', backend_admin),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)