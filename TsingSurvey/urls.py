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
from SUser.views import index, login, logout, user_list, admin_list, profile
from Survey.views import survey, bonus
from Analysis.views import analysis, search, report
from Utils.views import install
import settings

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    
    url(r'^$', index),
    url(r'^login/$', login),
    url(r'^logout/$', logout),
    url(r'^index/$', index),
    url(r'^user_list/$', user_list),
    url(r'^admin_list/$', admin_list),
    url(r'^profile/(\d{1,10})/$', profile),

    url(r'^survey/(\d{1,10})/$', survey),
    url(r'^bonus/', bonus),

    url(r'^analysis/$', analysis),
    url(r'^search/$', search),
    url(r'^report/(\d{1,10})/$', report),

    url(r'^install/$', install),
    url(r'^analysis/$', analysis),
]
