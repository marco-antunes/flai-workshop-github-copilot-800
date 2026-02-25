"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from . import views


def _build_url(name, request, format):
    """Build a full URL using the Codespace host when available, otherwise use request."""
    codespace_name = os.environ.get('CODESPACE_NAME', '')
    if codespace_name:
        base = f'https://{codespace_name}-8000.app.github.dev'
        path_part = reverse(name, request=None, format=format)
        return f'{base}{path_part}'
    return reverse(name, request=request, format=format)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': _build_url('user-list', request, format),
        'teams': _build_url('team-list', request, format),
        'activities': _build_url('activity-list', request, format),
        'leaderboard': _build_url('leaderboard-list', request, format),
        'workouts': _build_url('workout-list', request, format),
    })


router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'activities', views.ActivityViewSet)
router.register(r'leaderboard', views.LeaderboardViewSet)
router.register(r'workouts', views.WorkoutViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/root/', api_root, name='api-root'),
    path('', RedirectView.as_view(url='/api/', permanent=False)),
]
