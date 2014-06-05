<!-- LIST PROJECT NOTES -->
<div id="project-notes-list">
    <form>
        <input type="hidden" id="project-notes-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Notes</b></h3>&nbsp&nbsp
                    <a id="project-notes-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <table>
                    <tbody id="project-notes-list-table">
                    </tbody>
                </table>
                <a style="float:left;margin-top:5px;"></a>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="project-notes-list-part"></span>
                        <span class="all-page" id="project-notes-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="project-notes-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="project-notes-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>