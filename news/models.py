from django.db import models

class NewsArticle(models.Model):
    title = models.CharField(max_length=500)       
    description = models.TextField()
    url = models.URLField(max_length=1000)          
    image = models.URLField(max_length=1000)       
    published_at = models.DateTimeField()
    source = models.CharField(max_length=300) 

    class Meta:
        ordering = ['-published_at']
        indexes = [models.Index(fields=['-published_at'])]

    def __str__(self):
        return self.title