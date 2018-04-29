"""   SNAKES!!!
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from snakes.views import index

urlpatterns = [
	url(r'/', index)
]
